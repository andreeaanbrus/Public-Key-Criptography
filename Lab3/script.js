/* 1.key generation
     1.1) Generate 2 random large primes of aprox the same size
     1.2) Compute n = p * q, and the euler function phi(n) = (p-1)(q-1)
     1.3) Pick e -> 1 < e < phi(n), gcd (e, phi(n)) = 1
     1.4) Compute d = e^ -1 mod phi(n)
     1.5) KE = (n, e), KD = d
 */
let n, p, q, e, KE, KD, input, encrypted;

function isPrime(number) {
    if (number === 1 || number === 2)
        return true;
    if (number > 2 && number % 2 === 0)
        return false;
    for (let d = 3; d * d < number; d += 2)
        if (number % d === 0)
            return false;
    return true;
}

function generatePrime() {
//generate all prime numbers between 30 and 100 and pick 2 random ones; this will result in the fact that
// the encrypted chunk will always have the length three
    const primes = [];
    for (let i = 30; i < 100; i ++)
        if (isPrime(i))
            primes.push(i);
    p = primes[Math.floor(Math.random() * primes.length)];
    q = primes[Math.floor(Math.random() * primes.length)];

    while (p === q)
    {
        q = q = primes[Math.floor(Math.random() * primes.length)];
    }

    n = p * q;
}

function validate(event) {
    if(!isPrime(event.target.value)) {
        document.getElementById(event.srcElement.id).style.border = '1px solid red';
    }
    else {
        document.getElementById(event.srcElement.id).style.border = '1px solid';
    }
}

function euler() {
    return (p-1) * (q-1);
}

function gcd (a, b) {
    if (a % b === 0)
        return b;
    return gcd (b, a%b);
}

function pickE() {
    //for simplicity, pick the first possible e
    for (let e = 2; e < euler(n); e ++)
        if (gcd(e, euler(n)) === 1)
            return e;
}

function toBinary(number)
{
//  return the binary representation of n as a string
    let binaryRepresentation = '';
    while ( number !== 0 ) {
        binaryRepresentation = ( number % 2 === 0 ? "0" : "1" ) + binaryRepresentation;
        number = Math.floor(number / 2);
    }
    return binaryRepresentation;
}

function repeatedSquaring(b, k, n) {
    let a = 1;
    let binaryK = toBinary(k);
    if (binaryK === "0") {
        return a;
    }
    let c = b;
    if ( binaryK[binaryK.length - 1] === "1" ) {
        a = b;
    }
    for (let i = 1; i < binaryK.length; i++) {
        c = c * c % n;
        if ( binaryK[binaryK.length - i - 1] === '1')
            a = c * a % n;
    }
    return a;
}

function getD() {
// d = e ^ -1 mod euler(n)
// trivial solution, to not compute euler of euler

    let d = e, eulerNr = euler();
    for(let i = 1; i < eulerNr; ++i)
    {
        if(d * e % eulerNr === 1)
        {
            return d;
        }

        d = d * e % eulerNr;
    }
}

function init() {
    e = pickE();
    const d = getD();
    KE = {
        n: n,
        e: e
    };
    KD = {
        d : d
    };

    console.log("p: " +  p,"q: " + q, "n: " + n, "e: " + e, "KE: " + KE.e, KE.n,"KD: " + KD.d);
}

function changePQ()
{
    // check p * q is big enough

    let newp = document.getElementById('p').value;
    let newq = document.getElementById('q').value;
    if (isPrime(newp) && isPrime(newq) && newp * newq > 728 && newp !== newq)
    {
        p = newp;
        q = newq;
        n = p * q;
        init();
    }
    else {
        alert("Invalid numbers! The numbers must be prime, distinct, and their product above 728")
    }
}

/* Encryption
    2.1. Get public key KE = (n, e).
    2.2. Represent the message as a number m between 0 and n − 1.
    2.3. Computes c = m^e mod n.
 */
function encrypt() {
    input = document.getElementById('plain').value;
    document.getElementById('plain').value = '';

    let encryptedString = '';
    for(let i = 0; i < input.length; i += 2)
    {
        let chunk = input[i];
        ((i + 1) >= input.length) ? chunk += ' ' : chunk += input[i + 1];

        let code = repeatedSquaring(chunkToCode(chunk), e, n);

        encryptedString += codeToChunk(code);
        if(code < 729)
            encryptedString += ' ';
        if(code < 27)
            encryptedString += ' ';
    }

    console.log('Encrypted: ' + encryptedString);
    document.getElementById("encrypted").value = encryptedString;
    input = '';
}

/* Decryption
    3.1 Use the private key KD = d to get the message m = c^d mod n
*/
function decrypt() {
    encrypted = document.getElementById('encrypted').value;
    document.getElementById('encrypted').value = '';

    let decryptedString = '';
    for(let i = 0; i < encrypted.length; i += 3)
    {
        let chunk = encrypted[i];
        (i + 1 >= encrypted.length) ? chunk += ' ' : chunk += encrypted[i + 1];
        (i + 2 >= encrypted.length) ? chunk += ' ' : chunk += encrypted[i + 2];

        let code = repeatedSquaring(chunkToCode(chunk), getD(), n);
        let decryptedChunk = codeToChunk(code);
        if(decryptedChunk.length === 1)
            decryptedChunk += ' ';

        decryptedString += decryptedChunk;
    }

    console.log('Decrypted: ' + decryptedString);
    document.getElementById("plain").value = decryptedString;
    input = '';
    encrypted = '';
}

// ' ' corresponds to 0 and letters a-z correspond to numbers from 1 to 26
function  mapCharToCode(chr)
{
    if(chr === ' ')
        return 0;
    else
        return chr.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
}

function mapCodeToChar(code)
{
    if(code === 0)
        return ' ';
    else
        return String.fromCharCode(96 + code);
}

// we encrypt chunks of letters and the code corresponding to a chunk is in base 27
function chunkToCode(chrs)
{
    let code = 0, pow = 1;
    for(let i = 0; i < chrs.length; ++i)
    {
        code += pow * mapCharToCode(chrs[i]);
        pow *= 27;
    }

    return code;
}

function codeToChunk(code)
{
    if(code === 0)
        return ' ';

    let chunk = '';
    while(code !== 0)
    {
        chunk += mapCodeToChar(code % 27);
        code = Math.floor(code / 27);
    }

    return chunk;
}
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
    for (let d = 3; d * d < number; d += 3)
        if (number % d === 0)
            return false;
    return true;
}

function generatePrime() {
//generate all prime numbers between 3 and 100 and pick 2 random ones
    const primes = [];
    for (let i = 3; i < 100; i ++)
        if (isPrime(i))
            primes.push(i);
    p = primes[Math.floor(Math.random() * primes.length)];
    q = primes[Math.floor(Math.random() * primes.length)];
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

function euler(n) {
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
//    d = e ^ -1 mod euler(n)
    return repeatedSquaring(e, euler(n) - 1, euler(n));
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

function changePQ() {


    newp = document.getElementById('p').value;
    newq = document.getElementById('q').value;
    if (isPrime(newp) && isPrime(newq)) {
        p = newp;
        q = newq;
        n = p * q;
        init();
    }
    else {
        alert("Invalid numbers! The numbers must be prime")
    }
}

/* Encryption
    2.1. Get public key KE = (n, e).
    2.2. Represent the message as a number m between 0 and n − 1.
    2.3. Computes c = m^e mod n.
 */
function encrypt() {
    console.log("encrypt here");
    input = document.getElementById('plain').value;
    document.getElementById('plain').value = '';
    document.getElementById("encrypted").value = "Result of encryption should be here. But the input is " + input;
    input = ''
}

/* Decryption
    3.1 Use the private key KD = d to get the message m = c^d mod n
*/
function decrypt() {
    console.log("Decrypt text here pls");
    encrypted = document.getElementById('encrypted').value;
    document.getElementById('encrypted').value = '';
    document.getElementById("plain").value = "Result of decryption here. Encrypted text is: " + encrypted;
    encrypted = ''
}
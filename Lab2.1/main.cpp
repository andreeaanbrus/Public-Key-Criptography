#include <iostream>
#include <vector>

std::string toBinary(int n)
{
//  return the binary representation of n as a string
    std::string binaryRepresentation;
    while ( n != 0 ){
        binaryRepresentation = ( n % 2 == 0 ? "0" : "1" ) + binaryRepresentation;
        n /= 2;
    }
    return binaryRepresentation;
}

int repeatedSquaring(int b, int k, int n) {
//  perform repeated squaring algo for computing b^k mod n
    int a = 1;
    std::string binaryK = toBinary(k);
    if (binaryK == "0") {
        return a;
    }
    int c = b;
    if ( binaryK[binaryK.size() - 1] == '1' ) {
        a = b;
    }
    for (int i = 1; i < binaryK.size(); i++) {
        c = c * c % n;
        if ( binaryK[binaryK.size() - i - 1] == '1')
            a = c * a % n;
    }
    return a;
}

int gcd(int a, int b) {
    if (a % b == 0)
        return b;
    return gcd (b, a%b);
}

bool checkPseudoPrime(int n, int b) {
//  n is pseudoprime  for base b if b^n-1 = 1 mod n and gcd(a, n) = 1
    if ( gcd(b, n) != 1 )
        return false;
    return repeatedSquaring(b, n - 1, n) == 1;
}


std::vector<int> getBases (int n) {
    std::vector<int> result;
    result.push_back(1);
    for (int base = 2; base < n - 1; base ++)
        if ( checkPseudoPrime(n, base) )
            result.push_back(base);
    result.push_back(-1);
    return result;
}



int main() {
    while (true) {
        int number;
        std::cout << "Give the odd number: ";
        std::cin >> number;
        if (number % 2 == 0) {
            std::cout << "The number should be odd ";
            return 1;
        }
        std::vector<int> results = getBases(number);
        for (auto result: results)
            std::cout << result << ' ';
        std::cout << '\n';

    }
}
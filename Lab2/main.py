import math


def toBinary(k):
    # return the binary representation of k as string
    return "{0:b}".format(k)


def repeadedSquaring(b, k, n):
    # perform repeated squaring algo for computing b^k mod n
    a = 1
    k = toBinary(k)
    if k == '0':
        return a
    c = b
    if k[len(k) - 1] == '1':
        a = b
    for i in range(1, len(k)):
        c = c * c % n
        if k[len(k) - i - 1] == '1':
            a = c * a % n
    return a


def checkPseudoPrime(n, b):
    # n is pseudoprime  for base b if b^n-1 = 1 mod n and gcd(a, n) = 1
    if math.gcd(b, n) != 1:
        return False
    if repeadedSquaring(b, n - 1, n) != 1:
        return False
    return True


def getBases(n):
    #  every number is pseudoprime to 𝑎=1
    result = [1]
    for b in range(2, n - 1):
        if checkPseudoPrime(n, b):
            result.append(b)
    # every number is pseudoprime to 𝑎=−1≡𝑛−1(modulo𝑛).
    result.append(n - 1)
    return result


while (True):
    n = input("Give the number n")
    print("All bases 𝑏 with respect to which a composite odd number 𝑛 is pseudoprime " + getBases(int(n)).__str__())

alphabet = 'abcdefghijklmnopqrstuvwxyz '


def findLetterIndex(letter, set):
    # finding the position of the letter in the given set
    # the set could be the alphabet or the key
    for index in range(0, len(set)):
        if letter == set[index]:
            return index
    raise Exception('invalid letter. please use   the letters in the alphabet')


def encrypt(input_text, key, _alphabet=alphabet):
    if len(key) != len(_alphabet):
        raise Exception('the length of the key should be equal with the length of the alphabet')
    result = ''
    for letter in input_text:
        # find the corresponding letter in the key
        result += key[findLetterIndex(letter, _alphabet)]
    return result


def decrypt(encrypted_text, key, _alphabet=alphabet):
    if len(key) != len(_alphabet):
        raise Exception('the length of the key should be equal with the length of the alphabet')
    result = ''
    for letter in encrypted_text:
        # find the corresponding letter in the alphabet
        result += _alphabet[findLetterIndex(letter, key)]
    return result


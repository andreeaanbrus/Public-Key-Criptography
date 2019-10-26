from tkinter import *
from tkinter.messagebox import showerror

from algo import encrypt, decrypt


class Gui():
    def __init__(self, mainWindow):
        self.mainWindow = mainWindow
        self.inputTextVar = StringVar()
        self.resultTextVar = StringVar()
        self.keyTextVar = StringVar()
        self.yourAphabetVar = StringVar()
        self.yourKeyVar = StringVar()

        Label(mainWindow, text="Key for default aphabet (27 letters)").grid(row=0, column=0)
        Entry(mainWindow, textvariable=self.keyTextVar).grid(row=0, column=1)
        Label(mainWindow, text="Give your own alphabet").grid(row=1, column=0)
        Entry(mainWindow, textvariable=self.yourAphabetVar).grid(row=1, column=1)
        Label(mainWindow, text="The key for your aphabet").grid(row=1, column=2)
        Entry(mainWindow, textvariable=self.yourKeyVar).grid(row=1, column=3)
        Label(mainWindow, text="Input text").grid(row=2, column=0)
        Entry(mainWindow, textvariable=self.inputTextVar).grid(row=2, column=1)
        Label(mainWindow, text="Encrypted text").grid(row=2, column=2)
        Entry(mainWindow, textvariable=self.resultTextVar).grid(row=2, column=3)
        button = Button(mainWindow, text="Encrypt", command=self.encrypt)
        button.grid(row=4, column=1)
        button = Button(mainWindow, text="Decrypt", command=self.decrypt)
        button.grid(row=4, column=3)

    def encrypt(self):
        try:
            input = self.inputTextVar.get()
            key = self.keyTextVar.get()
            yourAlphabet = self.yourAphabetVar.get()
            yourKey = self.yourKeyVar.get()
            print(yourAlphabet, yourKey)
            if key is not '':
                self.yourKeyVar.set('')
                self.yourAphabetVar.set('')
                self.resultTextVar.set(encrypt(input, key))
            else:
                self.resultTextVar.set(encrypt(input, yourKey, yourAlphabet))
        except Exception as ex:
            print(ex)
            self.report_callback_exception(ex)

    def decrypt(self):
        try:
            encrypted_text = self.resultTextVar.get()
            key = self.keyTextVar.get()
            yourAlphabet = self.yourAphabetVar.get()
            yourKey = self.yourKeyVar.get()
            if key is not '':
                self.yourKeyVar.set('')
                self.yourAphabetVar.set('')
                self.inputTextVar.set(decrypt(encrypted_text, key))
            else:
                self.inputTextVar.set(decrypt(encrypted_text, yourKey, yourAlphabet))
        except Exception as ex:
            print(ex)
            self.report_callback_exception(ex)

    def report_callback_exception(self, exc):
        showerror("Error", message=str(exc))

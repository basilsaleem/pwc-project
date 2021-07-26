import {Injectable} from '@angular/core';
import SecureStorage from 'secure-web-storage';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'n85qQ57d8/j8qqdyyThRAIoXgQ2MJDm4FHG+DKxlVaw=';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {

  constructor() {
  }


  private secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key): any {
      key = CryptoJS.SHA256(key, SECRET_KEY);
      return key.toString();
    },

    // tslint:disable-next-line:typedef
    encrypt: function encrypt(data) {
      data = CryptoJS.AES.encrypt(data, SECRET_KEY);
      data = data.toString();
      return data;
    },

    // tslint:disable-next-line:typedef
    decrypt: function decrypt(data) {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY);
      data = data.toString(CryptoJS.enc.Utf8);
      return data;
    }
  });

  public setItem(key: string, value: any): void{
    this.secureStorage.setItem(key, value);
  }

  public getItem(key: string): any {
    return this.secureStorage.getItem(key);
  }

  public clear(): void{
    this.secureStorage.clear();
  }
}

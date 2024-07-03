import mysql, {Connection} from 'mysql2';
import { TokenData } from '../models/TokenData';
import {IStorageRepo, TStorageRepoDeps} from "../types/types";

export class SaveService implements IStorageRepo{
  private static instance: SaveService;
  private db: Connection | undefined = undefined;

  constructor(
      private readonly HOST: string,
      private readonly USER: string,
      private readonly PASSWORD: string,
      private readonly DATABASE: string
  ) {}

  static getInstance(deps: TStorageRepoDeps): IStorageRepo{
    if(!this.instance){
      return this.instance = new SaveService(deps.host,deps.user,deps.password,deps.database);
    }else{
      return this.instance;
    }
  }

  async init(){
    const db = mysql.createConnection({
      host: this.HOST,
      user: this.USER,
      password: this.PASSWORD,
      database: this.DATABASE
    });
    this.db = db;

    db.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return;
      }
      console.log('Connected to database successfully');
    });
  }

  async SaveDateToDB (tokenData: TokenData): Promise<TokenData | { error: string }> {
    return new Promise((resolve, reject) => {
      const { psut, token } = tokenData;

      // First, check if the psut already exists in the token table
      const checkQuery = 'SELECT * FROM tokens WHERE psut = ?';
      // todo: use async/await version instead on callbacks, e.g.: const [result] = await db.query(checkQuery);
      if(!this.db){
        throw new Error('Missing database connection');
      }
      this.db.query(checkQuery, [psut], (err, results) => {
        if (err) {
          console.error('Error checking psut in database:', err);
          reject({ error: 'Failed to check psut' });
          return;
        }
        if(!this.db){
          throw new Error('Missing database connection');
        }
        if (Array.isArray(results) && results.length > 0) {
          // If psut exists, update the existing record with the new token and set status to 'active'
          const updateQuery = 'UPDATE tokens SET token = ?, status = "active" WHERE psut = ?';
          this.db.query(updateQuery, [token, psut], (err, result) => {
            if (err) {
              console.error('Error updating data in database:', err);
              reject({ error: 'Failed to update data' });
            } else {
              console.log('Data updated in database successfully');
              console.log(result);
              resolve(tokenData);
            }
          });
        } else {
          // If psut does not exist, insert a new record
          const insertQuery = 'INSERT INTO tokens (psut, token, status) VALUES (?, ?, "active")';
          const values = [psut, token];
          this.db.query(insertQuery, values, (err, result) => {
            if (err) {
              console.error('Error saving data to database:', err);
              reject({ error: 'Failed to save data' });
              return ({ error: 'Failed to save data' }); // todo: what for this return?
            } else {
              console.log('Data saved to database successfully');
              resolve(tokenData);
              console.log(result);
              return ({ message: 'Data saved successfully' });
            }
          });
        }
      });
    });
  }

  async destroy(): Promise<void> {
    if(!this.db){
      // No need to destroy
    }else{
      this.db.destroy();
    }
  }
}
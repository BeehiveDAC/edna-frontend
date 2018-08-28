import {Injectable} from '@angular/core';
import * as Eos from 'eosjs';
import {environment} from '../../environments/environment';

@Injectable()
export class EosService {
  public eos: any;

  constructor() {
    this.eos = Eos({httpEndpoint: "http://193.93.219.219:8888"});
  }
}

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class PollsService {
  indexPolls = 0;
  polls = {};
  pollsObservers: any = {};
  pollsUpdatesObservable: Observable<any>;


  constructor(private http: HttpClient,
              private router: Router) {
  }

  init() {
    return this.getPolls();
  }

  getPolls() {
    return new Promise((resolve, reject) => {
      this.http.get('https://next.json-generator.com/api/json/get/NJlVOcRzB')
        .subscribe(
          res => {
            this.updatePoll(res);
            resolve(true);
          }, err => {
            console.error(err.error);
            reject(false);
          });
    });
  }

  updatePoll(poll) {
    const self = this;
    handleDepositUpdate(poll);

    function handleDepositUpdate(pollUpdates) {
      self.polls = Object.assign({}, self.polls, pollUpdates);
      Object.values(self.pollsObservers).forEach(observer => observer.next(pollUpdates));
    }

    this.pollsUpdatesObservable = new Observable(observer => {
      const thisIndex = this.indexPolls;
      this.indexPolls++;
      this.pollsObservers[thisIndex] = observer;
      observer.next(self.polls);
      return () => {
        delete this.pollsObservers[thisIndex];
    };
    });
  }

  getPollsUpdates() {
    return this.pollsUpdatesObservable;
  }
}

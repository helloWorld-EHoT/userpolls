import {Component, OnInit, OnDestroy} from '@angular/core';
import {PollsService} from '../services/polls.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  connectionPolls;

  dataPolls = {};
  resultPolls = [];
  iterationPolls = [];

  startStep = 0;
  errorChecked = false;
  finished = false;

  constructor(private pollsService: PollsService) {

  }

  ngOnInit() {
    this.pollsService.init().then(callback => {
      if (callback && !this.connectionPolls) {
        this.connectionPolls = this.pollsService.getPollsUpdates().subscribe(update => {
          this.dataPolls = Object.assign({}, this.dataPolls, update);
          console.log(this.dataPolls);
          const length = Object.keys(this.dataPolls).length;
          for (let i = 0; i < length; i++) {
            this.iterationPolls.push(i);
            this.getValueChecked(i);
          }
        });
      }
    });
  }

  getValueChecked(index) {
    const activeElement = localStorage.getItem(`elem${this.dataPolls[index]._id}`);
    if (activeElement) {
      this.dataPolls[index].children[activeElement].isActive = true;
    }
  }

  openPoll(index) {
    this.errorChecked = false;
    if (index < this.startStep || index > this.startStep && this.dataPolls[this.startStep].children.find(elem => elem.isActive)
      && index - this.startStep < 2) {
      this.startStep = index;
    } else {
      this.errorChecked = true;
    }
  }

  togglePoll(value) {
    this.errorChecked = false;
    if (value) {
      if (this.dataPolls[this.startStep].children.find(elem => elem.isActive)) {
        this.startStep++;
      } else {
        this.errorChecked = true;
      }
    } else {
      this.startStep--;
    }
  }

  checkElem(number) {
    this.errorChecked = false;
    this.dataPolls[this.startStep].children.forEach((elem, index) => {
      elem.isActive = index === number;
    });
    localStorage.setItem(`elem${this.dataPolls[this.startStep]._id}`, number);
  }

  viewResult() {
    this.errorChecked = false;
    if (this.dataPolls[this.startStep].children.find(elem => elem.isActive)) {
      const length = Object.keys(this.dataPolls).length;
      for (let i = 0; i < length; i++) {
        const filterElem = this.dataPolls[i].children.filter(elem => elem.isActive);
        this.resultPolls.push(filterElem[0]);
      }
      this.finished = true;
      localStorage.clear();
    } else {
      this.errorChecked = true;
    }
  }

  ngOnDestroy() {
    if (this.connectionPolls) {
      this.connectionPolls.unsubscribe();
    }
  }
}

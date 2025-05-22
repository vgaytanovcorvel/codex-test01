import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Project {
  id: number;
  name: string;
}

interface TimeEntry {
  id: number;
  description: string;
  hours: number;
  date: string;
  projectId: number;
  project?: Project;
}

@Component({
  selector: 'app-root',
  template: `
  <header class="cnn-header">CNN Time Tracker</header>
  <div class="container">
    <form (submit)="addEntry()" class="entry-form">
      <label>
        Project
        <select [(ngModel)]="projectId" name="projectId" required>
          <option *ngFor="let p of projects" [value]="p.id">{{ p.name }}</option>
        </select>
      </label>
      <label>
        Description
        <input [(ngModel)]="description" name="description" required>
      </label>
      <label>
        Hours
        <input type="number" step="0.25" [(ngModel)]="hours" name="hours" required>
      </label>
      <button type="submit">Add Entry</button>
    </form>

    <h2>Entries</h2>
    <ul>
      <li *ngFor="let entry of entries">
        <strong>{{ entry.project?.name }}</strong>: {{ entry.description }} - {{ entry.hours }}h on {{ entry.date | date }}
      </li>
    </ul>
  </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  projects: Project[] = [];
  entries: TimeEntry[] = [];
  description = '';
  hours = 0.25;
  projectId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProjects();
    this.loadEntries();
  }

  loadProjects() {
    this.http.get<Project[]>('/api/projects')
      .subscribe(data => {
        this.projects = data;
        if (this.projects.length && this.projectId === null) {
          this.projectId = this.projects[0].id;
        }
      });
  }

  loadEntries() {
    this.http.get<TimeEntry[]>('/api/timeentries')
      .subscribe(data => this.entries = data);
  }

  addEntry() {
    if (this.projectId == null) return;
    const entry = {
      description: this.description,
      hours: this.hours,
      date: new Date().toISOString(),
      projectId: this.projectId
    };
    this.http.post<TimeEntry>('/api/timeentries', entry)
      .subscribe(() => {
        this.description = '';
        this.hours = 0.25;
        this.loadEntries();
      });
  }
}

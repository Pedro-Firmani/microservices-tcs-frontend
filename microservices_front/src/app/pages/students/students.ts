import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.html'
})
export class StudentsComponent implements OnInit {
  usuarios: any;

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.api.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }
}

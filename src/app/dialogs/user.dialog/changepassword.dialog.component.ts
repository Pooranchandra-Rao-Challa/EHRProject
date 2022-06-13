import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './changepassword.dialog.component.html',
  styleUrls: ['./changepassword.dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { }
  ngOnInit(): void {

  }

  save() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}

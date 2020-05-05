import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		FormsModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,

		MatCardModule,
		MatToolbarModule,
		MatExpansionModule,
		MatButtonToggleModule,
		MatCheckboxModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatTableModule,
		MatSnackBarModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}

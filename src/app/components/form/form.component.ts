import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface SurveyData {
  faculty: string;
  stream: number;
  group: string;
  subjects: string[];
  averageGrade: '';
  technologies: boolean[];
  interviewTime: string;
  favoriteColor: string;
  email: string;
  comments: string;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}
  myForm!: FormGroup;
  technologies = ['React.js', 'TypeScript', 'Redux'];

  DEFAULT_FORM_VALUES: SurveyData = {
    faculty: 'faculty1',
    stream: 1,
    group: '',
    subjects: [],
    averageGrade: '',
    technologies: this.technologies.map(() => false),
    interviewTime: '',
    favoriteColor: '',
    email: '',
    comments: '',
  };

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      faculty: ['faculty1', Validators.required],
      stream: [1, Validators.required],
      group: ['', Validators.required],
      subjects: [[], Validators.required],
      averageGrade: ['', Validators.required],
      technologies: this.formBuilder.array(
        this.technologies.map((val) => this.formBuilder.control(false)),
        Validators.required
      ),
      interviewTime: ['', Validators.required],
      favoriteColor: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      comments: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const formData: SurveyData = this.myForm.value;
      this.saveData(formData);
      this.myForm.setValue(this.DEFAULT_FORM_VALUES);
    } else {
      alert("Всі поля обов'язкові до заповнення");
    }
  }

  saveData(data: SurveyData): void {
    let savedData: SurveyData[] = JSON.parse(
      localStorage.getItem('surveyData') || '[]'
    );
    savedData.push(data);
    localStorage.setItem('surveyData', JSON.stringify(savedData));

    alert('Дані успішно збережені!');
  }

  getFilteredDataByFaculty(faculty: string): SurveyData[] {
    const savedData: SurveyData[] = JSON.parse(
      localStorage.getItem('surveyData') || '[]'
    );
    return savedData.filter((data) => data.faculty === faculty);
  }

  getFilteredDataByTechnologyExperience(): SurveyData[] {
    const savedData: SurveyData[] = JSON.parse(
      localStorage.getItem('surveyData') || '[]'
    );
    return savedData.filter((data) =>
      (data.technologies || []).every((tech) => tech === true)
    );
  }

  getFilteredDataByGrade(minGrade: number): SurveyData[] {
    const savedData: SurveyData[] = JSON.parse(
      localStorage.getItem('surveyData') || '[]'
    );
    return savedData.filter(
      (data) => parseFloat(data.averageGrade) >= minGrade
    );
  }

  clearLocalStorage(): void {
    localStorage.clear();
    this.getFilteredData();
  }

  getFilteredData(): void {
    const savedData: SurveyData[] = JSON.parse(
      localStorage.getItem('surveyData') || '[]'
    );

    const facultyFilteredData = this.getFilteredDataByFaculty('faculty1');

    const facultyFilteredEmails = facultyFilteredData
      .map((data) => data.email)
      .join(', ');

    const filteredByFacultyElement =
      document.getElementById('filteredByFaculty');
    if (filteredByFacultyElement) {
      filteredByFacultyElement.textContent = facultyFilteredEmails;
    }

    const technologyExperienceFilteredData =
      this.getFilteredDataByTechnologyExperience();
    const technologyExperienceFilteredEmails = technologyExperienceFilteredData
      .map((data) => data.email)
      .join(', ');

    const filteredByTechnologyExperienceElement = document.getElementById(
      'filteredByTechnologyExperience'
    );
    if (filteredByTechnologyExperienceElement) {
      filteredByTechnologyExperienceElement.textContent =
        technologyExperienceFilteredEmails;
    }

    const minGrade = 3;
    const gradeFilteredData = this.getFilteredDataByGrade(minGrade);
    const gradeFilteredEmails = gradeFilteredData
      .map((data) => data.email)
      .join(', ');

    const filteredByAverageGradeElement = document.getElementById(
      'filteredByAverageGrade'
    );
    if (filteredByAverageGradeElement) {
      filteredByAverageGradeElement.textContent = gradeFilteredEmails;
    }
  }
}

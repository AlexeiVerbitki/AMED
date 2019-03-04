import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsLabComponent } from './documents-lab.component';

describe('DocumentsLabComponent', () => {
  let component: DocumentsLabComponent;
  let fixture: ComponentFixture<DocumentsLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

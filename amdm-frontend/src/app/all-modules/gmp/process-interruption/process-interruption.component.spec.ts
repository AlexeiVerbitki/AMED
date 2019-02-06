import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInterruptionComponent } from './process-interruption.component';

describe('ProcessInterruptionComponent', () => {
  let component: ProcessInterruptionComponent;
  let fixture: ComponentFixture<ProcessInterruptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessInterruptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInterruptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

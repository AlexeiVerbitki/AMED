import {Component, Directive, ElementRef, Inject, Input, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Country} from "../../../../models/country";
import {Currency} from "../../../../models/currency";
import {Subscription} from "rxjs";
import {PriceService} from "../../../../shared/service/prices.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Directive({
    selector: '[draggable]'
})
@Component({
  selector: 'app-exchange-modal',
  templateUrl: './exchange-modal.component.html',
  styleUrls: ['./exchange-modal.component.css']
})
export class ExchangeModalComponent implements OnInit {
  title: string = '';
  countries : Country[] = [];
  currencies: Currency[];
  priceEntity: FormGroup;
  avgCurrencies: any[] = [];

  private subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<ExchangeModalComponent>, private elementRef: ElementRef, private zone: NgZone,
              private priceService: PriceService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {

      this.avgCurrencies = data.currencies;

      this.priceEntity = fb.group({
          price:              [data.value, Validators.required],
          country:            [data.country, Validators.required],
          currency:           [data.currency, Validators.required],
      });
  }

  ngOnInit() {

      this.subscriptions.push(
          this.priceService.getCurrenciesShort().subscribe(currenciesData => {
                  this.currencies = currenciesData;
              },
          ));
  }


    save() {
        this.dialogRef.close(this.priceEntity.value);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(value => value.unsubscribe());

        // this.destroy$.next();
    }


   /* @Input() dragHandle: string;
    @Input() dragTarget: string;
    // Element to be dragged
    private target: HTMLElement;
    // Drag handle
    private handle: HTMLElement;
    private delta = {x: 0, y: 0};
    private offset = {x: 0, y: 0};

    private destroy$ = new Subject<void>();
    public ngAfterViewInit(): void {
        this.handle = this.dragHandle ? document.querySelector(this.dragHandle) as HTMLElement :
            this.elementRef.nativeElement;
        this.target = document.querySelector(this.dragTarget) as HTMLElement;
        this.setupEvents();
    }

    private setupEvents() {
        this.zone.runOutsideAngular(() => {
            let mousedown$ = fromEvent(this.handle, 'mousedown');
            let mousemove$ = fromEvent(document, 'mousemove');
            let mouseup$ = fromEvent(document, 'mouseup');

            let mousedrag$ = switchMap((event: MouseEvent) => {
                let startX = event.clientX;
                let startY = event.clientY;

                return mousemove$.pipe(map((event: MouseEvent) => {
                    event.preventDefault();
                    this.delta = {
                        x: event.clientX - startX,
                        y: event.clientY - startY
                    };
                })).pipe(takeUntil(mouseup$), takeUntil(this.destroy$));
            });

            mousedrag$.pipe  .subscribe(() => {
                if (this.delta.x === 0 && this.delta.y === 0) {
                    return;
                }

                this.translate();
            });

            mouseup$.takeUntil(this.destroy$).subscribe(() => {
                this.offset.x += this.delta.x;
                this.offset.y += this.delta.y;
                this.delta = {x: 0, y: 0};
            });
        });
    }

    private translate() {
        requestAnimationFrame(() => {
            this.target.style.transform = `
        translate(${this.offset.x + this.delta.x}px,
                  ${this.offset.y + this.delta.y}px)
      `;
        });
    }*/
}

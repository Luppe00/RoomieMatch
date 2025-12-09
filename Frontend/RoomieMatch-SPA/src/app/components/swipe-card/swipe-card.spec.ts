import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeCard } from './swipe-card';

describe('SwipeCard', () => {
  let component: SwipeCard;
  let fixture: ComponentFixture<SwipeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwipeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwipeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

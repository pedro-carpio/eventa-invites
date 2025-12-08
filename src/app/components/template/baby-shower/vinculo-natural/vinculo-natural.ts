import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { Contact } from '../../module/contact/contact';
import { Countdown } from '../../module/countdown/countdown';
import { Galery } from '../../module/galery/galery';
import { Guests } from '../../module/guests/guests';
import { Info } from '../../module/info/info';
import { Activity, Itinerary } from '../../module/itinerary/itinerary';
import { Rsvp } from '../../module/rsvp/rsvp';
import { ShareModal } from '../../modal/share-modal/share-modal';
import { babyShower } from '../../../../types/event/baby-shower.types';
import { LocationModal } from '../../modal/location-modal/location-modal';
import { Notes } from '../../module/notes/notes';
import { Gifts } from '../../module/gifts/gifts';
import { getDemoData } from './demo-objects';

@Component({
  selector: 'app-vinculo-natural',
  imports: [
    Contact,
    Countdown,
    Galery,
    Guests,
    Info,
    Itinerary,
    Rsvp,
    Notes,
    Gifts,
    ShareModal,
    LocationModal,
  ],
  templateUrl: './vinculo-natural.html',
  styleUrls: ['./vinculo-natural.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VinculoNatural implements OnInit {
  principalPhotoUrl = input<string>('https://placehold.co/600x400');
  eventData = input<babyShower>();

  currentEventData = signal<babyShower | undefined>(undefined);
  currentEventDate = signal<any>({ day: 1, month: 'JAN', year: 1970 });
  isLocationModalOpen = signal<boolean>(false);
  isShareModalOpen = signal<boolean>(false);

  ngOnInit() {
    if (this.eventData()) {
      this.currentEventData.set(this.eventData());
    } else {
      this.buildDemoData();
    }
    this.currentEventDate.set(this.getDate());
  }

  getDate() {
    const date = this.currentEventData() ? this.currentEventData()!.date : new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return { day, month, year };
  }

  getLocationData() {
    const venue = this.currentEventData()!.venue;
    const activities: Activity[] = [
      {
        title: 'Lugar del evento',
        name: venue.name,
      },
      {
        title: 'Dirección',
        name: venue.address + ', ' + venue.city,
        action: this.openLocationModal.bind(this),
        button: 'Ver Ubicación',
      },
    ];
    return activities;
  }

  openLocationModal() {
    this.isLocationModalOpen.set(true);
  }

  closeLocationModal() {
    this.isLocationModalOpen.set(false);
  }

  openShareModal() {
    this.isShareModalOpen.set(true);
  }

  closeShareModal() {
    this.isShareModalOpen.set(false);
  }

  buildDemoData() {
    const data = getDemoData();
    this.currentEventData.set(data);
  }
}

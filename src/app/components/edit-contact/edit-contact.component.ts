import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IContact } from 'src/app/models/IContact';
import { IGroup } from 'src/app/models/IGroup';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})

export class EditContactComponent implements OnInit {

  public loading: boolean = false;
  public contactId: string | null = null;
  public groups: IGroup[] = [] as IGroup[]; //
  public contact: IContact = {} as IContact;
  public errorMessage: string | null = null;

  constructor(private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.paramMap.subscribe((param: ParamMap) => {
      this.contactId = param.get('contactId');
    });
    if (this.contactId) {
      this.loading = true;
      this.contactService.getContact(this.contactId).subscribe((data) => {
        this.contact = data;
        this.loading = false;

        this.contactService.getAllGroups().subscribe((data) => {
          this.groups = data;
        }, (error) => {
          this.errorMessage = error;
          this.loading = false;
        });

      }, (error) => {
        this.errorMessage = error;
        this.loading = false;
      });
    }
  }

  public updateSubmit = () => {
    if (this.contactId != null) {
      this.contactService.updateContact(this.contactId, this.contact).subscribe((data: IContact) => {
        this.router.navigate(['/']).then();
      }, (error) => {
        this.errorMessage = error;
        this.router.navigate(['/contacts/edit/&{contactId}']).then();
      });
    }
  };
}

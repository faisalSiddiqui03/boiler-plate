import { GlobalSharedService } from '@cap-core/service/global-shared.service';
import { appInjector } from '@cap-core/app.injector';

export class BasePage {
  isModalOpen: boolean;
  protected globalSharedService: GlobalSharedService;

  constructor() {
    this.globalSharedService = appInjector.get(GlobalSharedService);
    this.isModalOpen = false;
  }
}

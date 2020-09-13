import { AppService } from './app.service';
import { User } from '../models/app.model';
import { Observable } from 'rxjs';

describe('User Authentication', () => {
    let authService: AppService;
    let mockHttp;
    beforeEach(() => {
        mockHttp = jasmine.createSpyObj('mockHttp', ['post', 'put'])
        authService = new AppService(mockHttp);
    });
    describe('Register User', () => {
        it('Register new user', () => { });
    });
});

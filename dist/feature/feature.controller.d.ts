import { CurrentUserDto } from 'src/auth/current-user.dto';
export declare class FeatureController {
    getPublicFeature(): string;
    getPrivateFeature(user: CurrentUserDto): string;
    getAdminFeature(): string;
}

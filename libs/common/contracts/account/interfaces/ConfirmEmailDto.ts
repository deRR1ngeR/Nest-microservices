import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
    @IsString()
    @IsNotEmpty()
    acctoken: string;

    @IsString()
    @IsNotEmpty()
    reftoken: string;

}

export default ConfirmEmailDto; 
import { AuthenticationModule } from 'src/modules/auth/auth.module';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { InvoiceModule } from 'src/modules/invoice/invoice.module';
import { ProductModule } from 'src/modules/product/product.module';
import { UserModule } from 'src/modules/user/user.module';

export const AllModules = [
  AuthenticationModule,
  UserModule,
  ClientsModule,
  ProductModule,
  InvoiceModule,
];

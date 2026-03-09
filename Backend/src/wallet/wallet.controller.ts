import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('manage')
  @ApiOperation({ summary: 'Admin: List wallets' })
  getWallets() {
    return this.walletService.listWallets();
  }

  @Get('manage/transactions')
  @ApiOperation({ summary: 'Admin: List recent transactions' })
  getAllTransactions() {
    return this.walletService.listTransactions();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user wallet' })
  getWallet(@Param('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Get(':walletId/transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  getTransactions(@Param('walletId') walletId: string) {
    return this.walletService.getTransactions(walletId);
  }
}

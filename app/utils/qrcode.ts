type CreateVietQRCodeType = {
  amount: number;
  bankBin: string;
  description: string;
  accountNumber: string;
};
export const getVietQrCodeLink = (data: CreateVietQRCodeType) => {
  const { amount, bankBin, description, accountNumber } = data;
  const url = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact.png?amount=${amount}&addInfo=thanh%20toan%20don%20hang%20TSA`;
  return url;
};

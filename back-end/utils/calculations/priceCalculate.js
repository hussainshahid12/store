function calculatePrice(prod, quantity) {
  const qty = Number(quantity) || 1;
  const price = Number(prod?.price) || 0;
  const discount = Number(prod?.discountPercentage) || 0;

  const totalPrice = price * qty;
  const discountAmount = (totalPrice * discount) / 100;
  const finalPrice = totalPrice - discountAmount;

  return {
    totalPrice: Number(totalPrice.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    finalPrice: Number(finalPrice.toFixed(2)),
  };
}

export default calculatePrice;

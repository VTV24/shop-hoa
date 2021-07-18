import { VndFormat } from '~src/services';

const mail = (order: IOrder) => {
    return `
      <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    
      <h1>Thanks for shopping with us</h1>
      <h4>Hi ${order.name},</h4>
      <h5>We have finished processing your order.</h5>
      <h2>[OrderID ${order._id}]</h2>
      <table style="font-size: 1.5rem; align: auto">
        <thead class="thead-light">
          <tr>
            <td><strong>Product</strong></td>
            <td><strong>Quantity</strong></td>
            <td  align="right"><strong align="right">Price</strong></td>
          </tr>
        </thead>
        <tbody>
          ${order.detail
              .map(
                  ({ hoa, quantity }) => `
            <tr>
              <td>${hoa.name}</td>
              <td align="center">${quantity}</td>
              <td align="right"> ${hoa.price.toFixed(2)} VNĐ</td>
            </tr>
          `,
              )
              .join('\n')}
        </tbody>
        <tfoot>
          <tr>
              <td colspan="3"><hr></td>
          </tr>
          <tr>
            <td colspan="2">Items Price:</td>
            <td align="right"> ${VndFormat(order.totalPrice)}</td>
          </tr>
          <tr>
            <td colspan="2">Tax Price:</td>
            <td align="right">${VndFormat(order.totalPrice * 0.1)}</td>
          </tr>
          <tr>
            <td colspan="2">Shipping Price:</td>
            <td align="right"> 40.000 VND</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Total Price:</strong></td>
            <td align="right"><strong> ${VndFormat(order.totalPrice * 1.1 + 40000)}</strong></td>
          </tr>
          <tr>
            <td colspan="2">Payment Method:</td>
            <td align="right">Cash on delivery</td>
          </tr>
        </tfoot>
      </table>
      <h2>Shipping address</h2>
      <p>
      ${order.name},<br/>
      ${order.address},<br/>
      ${order.phone},<br/>
      ${order.email},<br/>
      </p>
      <hr/>
      <p>Thanks for shopping with us.</p>
    `;
};

export default mail;

export const userSalesforceResponse: (
  successfulUpsert: boolean,
) => string = (successfulUpsert: boolean): string =>
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
      <Ack>true</Ack>
      <Success>${successfulUpsert}</Success>
    </notificationsResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

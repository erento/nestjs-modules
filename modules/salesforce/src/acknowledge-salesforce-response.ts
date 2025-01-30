export const acknowledgeSalesforceResponse: (acknowledged: boolean) => string = (acknowledged: boolean): string =>
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
      <Ack>${acknowledged}</Ack>
    </notificationsResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

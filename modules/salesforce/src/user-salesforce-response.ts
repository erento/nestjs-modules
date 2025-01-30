export const userSalesforceResponse: (
  acknowledged: boolean,
  crmSfAccountId: string,
  e1Id: string,
  e2UserId: string,
  userKey: string,
) => string = (acknowledged: boolean, crmSfAccountId: string, e1Id: string, e2UserId: string, userKey: string): string =>
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Body>
    <update xmlns="urn:partner.soap.sforce.com">
      <sObjects xsi:type="Account">
        <Ack>${acknowledged}</Ack>
        <Id>${crmSfAccountId}</Id>
        <Uid__c>${e1Id}</Uid__c>
        <E2UserId__c>${e2UserId}</E2UserId__c>
        <MyErentoLink__c>https://intranet.erento.com/?adminmenu=626&process=658&userKey=${userKey}</MyErentoLink__c>
        <SdpUrl__c>https://www.erento.com/anbieter/${e2UserId}</SdpUrl__c>
      </sObjects>
    </update>
  </soapenv:Body>
</soapenv:Envelope>`;

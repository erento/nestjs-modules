import {OutboundMessagesParser, SalesforceObject} from './outbound-messages.parser';

// eslint-disable-next-line max-len
const exampleInput: string = '{"soapenv:envelope":{"$":{"xmlns:soapenv":"http://schemas.xmlsoap.org/soap/envelope/","xmlns:xsd":"http://www.w3.org/2001/XMLSchema","xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"},"soapenv:body":[{"notifications":[{"$":{"xmlns":"http://soap.sforce.com/2005/09/outbound"},"organizationid":["00Db0000000dWXIEA2"],"actionid":["04k0X0000004EvSQAU"],"sessionid":["00Db0000000dWXI!AQYAQC1lpfDaggIZ4mmSEX5Cu8TVCOOBmhOnY8jXPGTuj5ufyb41iwp5AMm3xNeqsse0wXQa9gMN50FiBSdPepPuhnakF4Y1"],"enterpriseurl":["https://erento.my.salesforce.com/services/Soap/c/43.0/00Db0000000dWXI"],"partnerurl":["https://erento.my.salesforce.com/services/Soap/u/43.0/00Db0000000dWXI"],"notification":[{"id":["04l0X00001FxohBQAR"],"sobject":[{"$":{"xsi:type":"sf:Billing_Contract_Line__c","xmlns:sf":"urn:sobject.enterprise.soap.sforce.com"},"sf:id":["a430X000000ytuiQAA"],"sf:accountowner__c":["005b0000001VIpR"],"sf:accountuid__c":["3005713"],"sf:toppositionactive__c":["1.0"],"sf:toppositioncategory__c":["020616"],"sf:toppositioncodee2__c":["DE-50-2794_01"],"sf:toppositioncountry__c":["3"],"sf:toppositionzip__c":["50"]}]},{"id":["04l0X00001FxohAAAA"],"sobject":[{"$":{"xsi:type":"sf:Billing_Contract_Line__c","xmlns:sf":"urn:sobject.enterprise.soap.sforce.com"},"sf:id":["a430X000000ytuiQAA"],"sf:accountowner__c":["005b0000001VIpR"],"sf:accountuid__c":["3005713"],"sf:toppositionactive__c":["1.0"],"sf:toppositioncategory__c":["020616"],"sf:toppositioncodee2__c":["DE-10-2794_01"],"sf:toppositioncountry__c":["3"],"sf:toppositionzip__c":["10"]}]}]}]}]}}';

describe('Outbound Messages Parser', (): void => {
    let service: OutboundMessagesParser;

    beforeEach((): void => {
        service = new OutboundMessagesParser();
    });

    describe('should process salesforce messages', (): void => {
        test('with empty type', (): void => {
            const transformer: (input: SalesforceObject) => any = (value: SalesforceObject): any => value;
            expect(service.parse(JSON.parse(exampleInput), '', transformer)).toEqual([]);
        });

        test('with unknown type', (): void => {
            const transformer: (input: SalesforceObject) => any = (value: SalesforceObject): any => value;
            expect(service.parse(JSON.parse(exampleInput), 'unknown', transformer)).toEqual([]);
        });

        test('with top position type', (): void => {
            const transformer: (input: SalesforceObject) => any = (value: SalesforceObject): any => value;
            expect(service.parse(JSON.parse(exampleInput), 'sf:Billing_Contract_Line__c', transformer)).toMatchSnapshot();
        });
    });
});

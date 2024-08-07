import { SERVICE_NAME } from '../../common/data/enums/appName';
import { getServiceUrl } from '../../common/utils/envUrls';

export const requestUrl = (
  serviceName: SERVICE_NAME, endpoint: string
): string => {
  return `${getServiceUrl(serviceName)}/${endpoint}`;
};

export function assignHeaders(targetObject: any, arrayOfObjects: any[]): any {
  for (const header of arrayOfObjects) {
    targetObject[header.name] = header.value;
  }
  return targetObject;
}

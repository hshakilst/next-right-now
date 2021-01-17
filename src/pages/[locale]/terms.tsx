import { createLogger } from '@unly/utils-simple-logger';
import {
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import React from 'react';
import DefaultLayout from '../../common/components/layouts/DefaultLayout';
import LegalContent from '../../common/components/dataDisplay/LegalContent';
import useCustomer from '../../modules/data/hooks/useCustomer';
import { Customer } from '../../modules/data/types/Customer';
import { CommonServerSideParams } from '../../modules/bootstrapping/types/CommonServerSideParams';
import { OnlyBrowserPageProps } from '../../modules/app/types/OnlyBrowserPageProps';
import { SSGPageProps } from '../../modules/app/types/SSGPageProps';
import { AMPLITUDE_PAGES } from '../../modules/amplitude/amplitude';
import { replaceAllOccurrences } from '../../modules/js/string';
import {
  getCommonStaticPaths,
  getCommonStaticProps,
} from '../../modules/app/SSG';

const fileLabel = 'pages/[locale]/terms';
const logger = createLogger({ // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
  label: fileLabel,
});

/**
 * Only executed on the server side at build time
 * Necessary when a page has dynamic routes and uses "getStaticProps"
 */
export const getStaticPaths: GetStaticPaths<CommonServerSideParams> = getCommonStaticPaths;

/**
 * Only executed on the server side at build time.
 *
 * @return Props (as "SSGPageProps") that will be passed to the Page component, as props
 *
 * @see https://github.com/vercel/next.js/discussions/10949#discussioncomment-6884
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps: GetStaticProps<SSGPageProps, CommonServerSideParams> = getCommonStaticProps;

/**
 * SSG pages are first rendered by the server (during static bundling)
 * Then, they're rendered by the client, and gain additional props (defined in OnlyBrowserPageProps)
 * Because this last case is the most common (server bundle only happens during development stage), we consider it a default
 * To represent this behaviour, we use the native Partial TS keyword to make all OnlyBrowserPageProps optional
 *
 * Beware props in OnlyBrowserPageProps are not available on the server
 */
type Props = {} & SSGPageProps<Partial<OnlyBrowserPageProps>>;

/**
 * Terms page, that displays all legal-related information.
 *
 * Basically displays a bunch of markdown that's coming from the CMS.
 */
const TermsPage: NextPage<Props> = (props): JSX.Element => {
  const customer: Customer = useCustomer();
  const { termsDescription, serviceLabel } = customer || {};

  // Replace dynamic values (like "{customerLabel}") by their actual value
  const terms = replaceAllOccurrences(termsDescription, {
    serviceLabel: `**${serviceLabel}**`,
    customerLabel: `**${customer?.label}**`,
  });

  return (
    <DefaultLayout
      {...props}
      pageName={AMPLITUDE_PAGES.TERMS_PAGE}
    >
      <LegalContent
        content={terms}
      />
    </DefaultLayout>
  );
};

export default (TermsPage);

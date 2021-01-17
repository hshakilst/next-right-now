import { createLogger } from '@unly/utils-simple-logger';
import {
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
import React from 'react';
import {
  Alert,
  Button,
} from 'reactstrap';

import BuiltInUtilitiesSidebar from '../../../../common/components/nrnDoc/BuiltInUtilitiesSidebar';
import DocPage from '../../../../common/components/nrnDoc/DocPage';
import I18nLink from '../../../../modules/i18n/components/I18nLink';
import DefaultLayout from '../../../../common/components/layouts/DefaultLayout';
import Code from '../../../../common/components/dataDisplay/Code';
import ExternalLink from '../../../../common/components/dataDisplay/ExternalLink';
import { CommonServerSideParams } from '../../../../modules/bootstrapping/types/CommonServerSideParams';
import { OnlyBrowserPageProps } from '../../../../modules/app/types/OnlyBrowserPageProps';
import { SSGPageProps } from '../../../../modules/app/types/SSGPageProps';
import {
  getExamplesCommonStaticPaths,
  getExamplesCommonStaticProps,
} from '../../../../modules/app/SSG';

const fileLabel = 'pages/[locale]/examples/built-in-utilities/tracking-useless-re-renders';
const logger = createLogger({ // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
  label: fileLabel,
});

/**
 * Only executed on the server side at build time
 * Necessary when a page has dynamic routes and uses "getStaticProps"
 */
export const getStaticPaths: GetStaticPaths<CommonServerSideParams> = getExamplesCommonStaticPaths;

/**
 * Only executed on the server side at build time.
 *
 * @return Props (as "SSGPageProps") that will be passed to the Page component, as props
 *
 * @see https://github.com/vercel/next.js/discussions/10949#discussioncomment-6884
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps: GetStaticProps<SSGPageProps, CommonServerSideParams> = getExamplesCommonStaticProps;

/**
 * SSG pages are first rendered by the server (during static bundling)
 * Then, they're rendered by the client, and gain additional props (defined in OnlyBrowserPageProps)
 * Because this last case is the most common (server bundle only happens during development stage), we consider it a default
 * To represent this behaviour, we use the native Partial TS keyword to make all OnlyBrowserPageProps optional
 *
 * Beware props in OnlyBrowserPageProps are not available on the server
 */
type Props = {} & SSGPageProps<Partial<OnlyBrowserPageProps>>;

const TrackingUselessReRendersPage: NextPage<Props> = (props): JSX.Element => {
  return (
    <DefaultLayout
      {...props}
      pageName={'tracking-useless-re-renders'}
      headProps={{
        seoTitle: 'Tracking useless re-renders examples - Next Right Now',
      }}
      Sidebar={BuiltInUtilitiesSidebar}
    >
      <DocPage>
        <h1 className={'pcolor'}>Tracking useless re-renders examples, using <code>why-did-you-render</code></h1>

        <Alert color={'info'}>
          <ExternalLink href={'https://github.com/welldone-software/why-did-you-render'}>why-did-you-render</ExternalLink> is a library that's built-in and will warn you about useless React re-renderings.<br />
          It's enabled by default (only during development).
        </Alert>

        <p>
          Let's take the below example with the <code>Code</code> component.<br />
          This component uses the <code>CodeBlock</code> and <code>ReactAsyncHighlighter</code> components. <br />
          You may have noticed (if you've cloned NRN locally and played around) that there are a few warnings regarding <code>ReactAsyncHighlighter</code> being re-rendered with <code>Re-rendered although props and state objects are the same.</code> warning.<br />
          This warning is generated by <code>why-did-you-render</code> and tells us something is wrong with the <code>ReactAsyncHighlighter</code> component.<br />
          Unfortunately, because it's a nested dependency, it's quite hard for us to do anything to fix that, we can't do much rather than telling the maintainers about the issue.<br />
          <br />
          What we can do, is to see how <code>why-did-you-render</code> can help us with our own <code>Code</code> component.
        </p>

        <Button>
          <I18nLink href={'/examples/built-in-utilities/tracking-useless-re-renders'}>Refresh the page (CSR)</I18nLink>
        </Button>

        <p>
          Clicking on the button above will generate a warning in the browser console (development env only)
        </p>

        <br />

        <Code
          codeBlockStyle={{
            margin: 0,
            textAlign: 'left',
          }}
          text={`
            <Code
              codeBlockStyle={{
                margin: 0,
                textAlign: 'left',
              }}
            />
          `}
        />

        <br />

        <p>
          But, the below code wouldn't generate a warning
        </p>

        <Code
          text={`
            <Code />
          `}
        />
        <br />

        <Alert color={'info'}>
          <b>Why is that?</b><br />
          The answer is simple, it's because codeBlockStyle takes an object as property, and this object is being redefined every time with a new reference.<br />
          Because the reference between the old render and the new render is different, React shallow comparison believes it's a different value, even though the value is actually the same.<br />
          This kind of mistakes are caught by <code>why-did-you-render</code> and are visible in the console, so that it's easier to notice, and fix.<br />
          In the above case, what can be done to avoid such issue is to define the <code>codeBlockStyle</code> value before (using <code>const codeBlockStyle = ...</code>) so that the reference won't change.<br />
          <br />
          And guess why we took this example?<br />
          Exactly, we actually made that exact mistake when writing NRN demo, and we thought that'd be a great example. (^_^)'
        </Alert>

      </DocPage>
    </DefaultLayout>
  );
};

export default (TrackingUselessReRendersPage);

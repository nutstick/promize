import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { ChildProps } from 'react-apollo';
import { Dropdown } from 'semantic-ui-react';
import { graphql } from '../../apollo/graphql';
import { LocaleQuery } from '../../apollo/intl';
import * as LOCALEQUERY from '../../apollo/LocaleQuery.gql';
import * as SETLOCALEMUTATION from '../../apollo/SetLocaleMutation.gql';
import * as s from './LanguageSwitcher.css';

namespace LanguageSwitcher {
  export type Props = ChildProps<{}, LocaleQuery>;
}

@withStyles(s)
@graphql<{}, LocaleQuery>(LOCALEQUERY)
@graphql<{}, {}>(SETLOCALEMUTATION)
export class LanguageSwitcher extends React.Component<LanguageSwitcher.Props> {
  private onLanguageChange(_, { value }) {
    this.props.mutate({ variables: { locale: value } });
  }

  public render() {
    const { locale, availableLocales } = this.props.data;
    const isSelected = (locale_) => locale_ === locale;
    const localeDict = {
      /* @intl-code-template '${lang}-${COUNTRY}': '${Name}', */
      'en-US': 'English',
      'th-TH': 'ไทย',
      'cs-CZ': 'Česky',
      /* @intl-code-template-end */
    };
    const localeName = (locale_) => localeDict[locale_] || locale_;
    const launguageOptions = availableLocales.map((locale_) => ({
      text: localeName(locale_),
      value: locale_,
    }));

    return (
      <Dropdown
        inline
        options={launguageOptions}
        defaultValue={locale}
        onChange={this.onLanguageChange.bind(this)} />
    );
    // return (
    //   <div>
    //     {availableLocales.map((locale_) =>
    //       <span key={locale_}>
    //         {isSelected(locale_)
    //           ? <span>
    //               {localeName(locale_)}
    //             </span>
    //           : <a
    //               href={`?lang=${locale_}`}
    //               onClick={(e) => {
    //                 this.props.mutate({ variables: { locale: locale_ } });
    //                 e.preventDefault();
    //               }}
    //             >
    //               {localeName(locale_)}
    //             </a>}{' '}
    //       </span>,
    //     )}
    //   </div>
    // );
  }
}

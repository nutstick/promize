import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import * as s from './SearchInput.css';
import { UserKeyword } from './UserKeyword';

namespace SearchInput {
  export interface HashtagKeyword {
    keyword: string;
  }
  export type Keyword = UserKeyword.IProps | HashtagKeyword;

  export interface IProps {
    url: string;
    keywords?: Keyword[];
    onSubmit?: (e, keywords: Keyword[]) => void;
  }

  export type Props = IProps;

  export interface State {
    keywords: Keyword[];
    value: string;
  }
}

@withStyles(s)
export class SearchInput extends React.Component<SearchInput.Props, SearchInput.State> {
  constructor(props) {
    super(props);

    this.state = {
      keywords: props.keywords || [],
      value: '',
    };
  }

  public componentWillReceiveProps(nextProps) {
    if (nextProps.url === '/search') {
      this.setState({
        keywords: nextProps.keywords,
      });
    }
  }

  private onChange(event: React.SyntheticEvent<HTMLInputElement>): void {
    const newValue: string = (event.target as any).value;

    const newKeywords = newValue.split(' ').map((value) => ({
      keyword: value,
    }));

    this.setState(({ keywords }) => ({
      keywords: newKeywords[0].keyword !== '' ? keywords.concat(newKeywords.slice(0, -1)) : keywords,
      value: newKeywords[newKeywords.length - 1].keyword,
    }));
  }

  private onKeyDown(event) {
    if (event.key === 'Backspace' && this.state.value.length === 0) {
      if (this.state.keywords.length > 0) {
        this.setState(({ keywords, value }) => ({
          keywords: keywords.slice(0, -1),
          value,
        }));
      }
    }
  }

  private onKeyPress(event: React.KeyboardEventHandler<HTMLInputElement>): void {
    if ((event as any).key === 'Enter') {
      this.props.onSubmit(
        event,
        this.state.keywords
          .concat(this.state.value.length > 0 ? [({ keyword: this.state.value } as SearchInput.Keyword)] : []),
      );

      this.setState({
        value: '',
      });
    }
  }

  private onClick(event: React.SyntheticEvent<HTMLInputElement>): void {
    this.props.onSubmit(
      event,
      this.state.keywords
        .concat(this.state.value.length > 0 ? [({ keyword: this.state.value } as SearchInput.Keyword)] : []),
    );

    this.setState({
      value: '',
    });
  }

  public render() {
    return (
      <div className={s.root}>
        {this.state.keywords.map((keyword, index) => (keyword as UserKeyword.IProps).id ? (
          <UserKeyword id={(keyword as UserKeyword.IProps).id}/>
        ) : <span className={s.hashtagKeyword}>
          {(keyword as SearchInput.HashtagKeyword).keyword}
        </span>)}
        <input
          className={s.input}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)} />
        <Icon
          className={s.button}
          name="search"
          color="black"
          onClick={this.onClick.bind(this)} />
      </div>
    );
  }
}

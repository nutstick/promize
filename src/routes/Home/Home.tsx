import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import * as arrowLeft from './arrowleft.png';
import * as arrowRight from './arrowright.png';
import * as s from './Home.css';

export namespace Home {
  export type Props = any;
}

@withStyles(s)
export class Home extends React.Component<Home.Props> {
  public componentDidMount() {
    document.title = 'Home';
  }

  public render() {
    return (
      <Container>
        <div className={s.trendingBanner}>
          <div className={s.trendingHastags}>
            Trending Hastags
          </div>
          <div className={s.trendingButton}>
            <div className={s.circleButton}>
              <img className={s.buttonArrow} src={arrowLeft} />
            </div>
            <div className={s.circleButton}>
              <img className={s.buttonArrow} src={arrowRight} />
            </div>
          </div>
          <div className={s.trendingBlock}>
            <div className={s.trendingBlockText}>
              50 Percent Off
            </div>
            <div className={s.trendingBlockDecorate} />
          </div>
        </div>
      </Container>
    );
  }
}

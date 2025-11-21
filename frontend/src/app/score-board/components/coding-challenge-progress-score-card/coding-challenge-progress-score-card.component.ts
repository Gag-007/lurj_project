import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { groupBy } from 'lodash-es'
import { ScoreCardComponent } from '../score-card/score-card.component'
import { ChallengeCategorySummaryComponent, type ChallengeCategorySummary } from '../challenge-category-list/challenge-category-list.component'
import { TranslateModule } from '@ngx-translate/core'

export interface CodingChallenge {
  category: string
  hasCodingChallenge: boolean
  codingChallengeStatus?: number
}

@Component({
  selector: 'coding-challenge-progress-score-card',
  templateUrl: './coding-challenge-progress-score-card.component.html',
  styleUrls: ['./coding-challenge-progress-score-card.component.scss'],
  imports: [ScoreCardComponent, ChallengeCategorySummaryComponent, TranslateModule]
})
export class CodingChallengeProgressScoreCardComponent implements OnInit, OnChanges {
  @Input() allChallenges: CodingChallenge[] = []

  public challengeCategories: ChallengeCategorySummary[] = []

  totalScore = 0
  totalSolved = 0

  ngOnInit(): void {
    this.update()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update()
  }

  private update(): void {
    this.challengeCategories = this.recalculate(this.allChallenges)

    this.totalScore = this.challengeCategories.reduce((sum, c) => sum + c.total, 0)
    this.totalSolved = this.challengeCategories.reduce((sum, c) => sum + c.solved, 0)
  }

  private recalculate(challenges: CodingChallenge[]): ChallengeCategorySummary[] {
    const grouped = groupBy(challenges, 'category')

    return Object.entries(grouped).map(([category, list]) => {
      const listArr = list as CodingChallenge[]

      const solved = listArr
        .map(c => c.codingChallengeStatus || 0)
        .reduce((acc, x) => acc + x, 0)

      const total = listArr.filter(c => c.hasCodingChallenge).length * 2

      return { name: category, solved, total }
    })
  }
}

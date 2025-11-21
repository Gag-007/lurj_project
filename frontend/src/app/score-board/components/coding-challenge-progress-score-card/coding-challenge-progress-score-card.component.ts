import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { groupBy } from 'lodash-es'
import { ScoreCardComponent } from '../score-card/score-card.component'
import { ChallengeCategorySummaryComponent, type ChallengeCategorySummary } from '../challenge-category-list/challenge-category-list.component'
import { TranslateModule } from '@ngx-translate/core'
import { JsonPipe } from '@angular/common'

export interface CodingChallenge {
  category: string
  hasCodingChallenge: boolean
  codingChallengeStatus?: number
}

@Component({
  selector: 'coding-challenge-progress-score-card',
  templateUrl: './coding-challenge-progress-score-card.component.html',
  styleUrls: ['./coding-challenge-progress-score-card.component.scss'],
  imports: [ScoreCardComponent, ChallengeCategorySummaryComponent, TranslateModule, JsonPipe]
})
export class CodingChallengeProgressScoreCardComponent implements OnInit, OnChanges {
  @Input() allChallenges: CodingChallenge[] = []

  public challengeCategories: ChallengeCategorySummary[] = []

  ngOnInit(): void {
    this.update()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update()
  }

  private update(): void {
    const list = this.allChallenges ?? []
    this.challengeCategories = this.recalculate(list)
  }

  private recalculate(challenges: CodingChallenge[]): ChallengeCategorySummary[] {
    const grouped = groupBy(challenges, 'category')

    return Object.entries(grouped).map(([category, items]) => {
      const listArr = items as CodingChallenge[]   // <-- ключевое исправление strict mode

      const solved = listArr.reduce(
        (acc, c) => acc + (c.codingChallengeStatus ?? 0),
        0
      )

      const total = listArr.filter(c => c.hasCodingChallenge).length * 2

      return {
        name: category,
        solved,
        total
      }
    })
  }
}

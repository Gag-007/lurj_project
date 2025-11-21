import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { type EnrichedChallenge } from '../../types/EnrichedChallenge'
import { TranslateModule } from '@ngx-translate/core'
import { ScoreCardComponent } from '../score-card/score-card.component'
import { JsonPipe } from '@angular/common'
import { groupBy } from 'lodash-es'
import { type ChallengeCategorySummary, ChallengeCategorySummaryComponent } from '../challenge-category-list/challenge-category-list.component'

@Component({
  selector: 'hacking-challenge-progress-score-card',
  templateUrl: './hacking-challenge-progress-score-card.component.html',
  styleUrls: ['./hacking-challenge-progress-score-card.component.scss'],
  imports: [ScoreCardComponent, ChallengeCategorySummaryComponent, TranslateModule, JsonPipe]
})
export class HackingChallengeProgressScoreCardComponent implements OnInit, OnChanges {
  @Input() public allChallenges: EnrichedChallenge[] = []

  public solvedChallenges = 0
  public challengeCategories: ChallengeCategorySummary[] = []

  ngOnInit(): void {
    this.update()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update()
  }

  private update(): void {
    const list = this.allChallenges ?? []

    this.solvedChallenges = list.filter(c => c.solved).length
    this.challengeCategories = this.calculateChallengeCategorySummary(list)
  }

  private calculateChallengeCategorySummary(challenges: EnrichedChallenge[]): ChallengeCategorySummary[] {
  const grouped = groupBy(challenges, 'category')

  return Object.entries(grouped).map(([category, list]) => {
    const arr = list as EnrichedChallenge[] // <-- ключевое исправление

    return {
      name: category,
      solved: arr.filter(c => c.solved).length,
      total: arr.length
    }
  })
}


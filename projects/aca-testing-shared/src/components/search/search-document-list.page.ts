/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { ElementFinder, ElementArrayFinder, by } from 'protractor';
import { DocumentListPage } from '@alfresco/adf-testing';

export class SearchDocumentListPage extends DocumentListPage {

  private static selectors = {
    searchResultsRow: 'aca-search-results-row',
    searchResultsRowLine: '.line'
  };

  private getSearchResultsRowByName(name: string): ElementFinder {
    return this.dataTable.rootElement.element(by.cssContainingText(SearchDocumentListPage.selectors.searchResultsRow, name));
  }

  private getSearchResultRowLines(name: string): ElementArrayFinder {
    return this.getSearchResultsRowByName(name).all(by.css(SearchDocumentListPage.selectors.searchResultsRowLine));
  }

  async getSearchResultLinesCount(name: string): Promise<number> {
    return this.getSearchResultRowLines(name).count();
  }

  private getSearchResultNthLine(name: string, index: number): ElementFinder {
    return this.getSearchResultRowLines(name).get(index);
  }

  async getSearchResultNameAndTitle(name: string): Promise<string> {
    return this.getSearchResultNthLine(name, 0).getText();
  }

  async getSearchResultDescription(name: string): Promise<string> {
    return this.getSearchResultNthLine(name, 1).getText();
  }

  async getSearchResultModified(name: string): Promise<string> {
    return this.getSearchResultNthLine(name, 2).getText();
  }

  async getSearchResultLocation(name: string): Promise<string> {
    return this.getSearchResultNthLine(name, 3).getText();
  }

  getNthSearchResultsRow(nth: number): ElementFinder {
    return this.getSearchResultsRows().get(nth - 1);
  }

  private getSearchResultsRows(): ElementArrayFinder {
    return this.dataTable.rootElement.all(by.css(SearchDocumentListPage.selectors.searchResultsRow));
  }

  async clickSearchResultNameLink(itemName: string): Promise<void> {
    await this.getSearchResultNameLink(itemName).click();
  }

  private getSearchResultNameLink(itemName: string): ElementFinder {
    return this.dataTable.getRow('Display name', itemName).$('.link');
  }

  async hasLinkOnSearchResultName(itemName: string): Promise<boolean> {
    return this.getSearchResultNameLink(itemName).isPresent();
  }
}

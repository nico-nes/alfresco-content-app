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

import { element, ElementFinder, by, ElementArrayFinder } from 'protractor';
import { DocumentListPage } from '@alfresco/adf-testing';

export class ACADocumentListPage extends DocumentListPage {

  emptySearchText: ElementFinder;

  private static selectors = {
    columnHeader: '.adf-datatable-row .adf-datatable-cell-header .adf-datatable-cell-value',
    sortedColumnHeader: `
      .adf-datatable__header--sorted-asc .adf-datatable-cell-value,
      .adf-datatable__header--sorted-desc .adf-datatable-cell-value
    `,
    row: '.adf-datatable-row[role]',
    cell: '.adf-datatable-cell-container',
    lockOwner: '.aca-locked-by',
  };

  constructor(rootElement = element.all(by.css('adf-document-list')).first()) {
    super(rootElement);
    this.emptySearchText = this.rootElement.element(by.css('.empty-search__text'));
  }

  private async hasLockOwnerInfo(name: string): Promise<boolean> {
    return this.dataTable.getRow('Display name', name).element(by.css(ACADocumentListPage.selectors.lockOwner)).isPresent();
  }

  async getLockOwner(itemName: string): Promise<string> {
    if (await this.hasLockOwnerInfo(itemName)) {
      return this.dataTable.getRow('Display name', name).$(ACADocumentListPage.selectors.lockOwner).$('.locked_by--name').getText();
    }
    return '';
  }

  async getSortedColumnHeaderText(): Promise<string> {
    return this.getSortedColumnHeader().getText();
  }

  private getSortedColumnHeader(): ElementFinder {
    const locator = by.css(ACADocumentListPage.selectors.sortedColumnHeader);
    return this.dataTable.rootElement.element(locator);
  }

  getColumnHeaderByLabel(label: string): ElementFinder {
    const locator = by.cssContainingText(ACADocumentListPage.selectors.columnHeader, label);
    return this.dataTable.rootElement.element(locator);
  }

  async getSitesNameAndVisibility(): Promise<any> {
    const data: string[] = await this.getEntireDataTableText();
    return data.reduce((acc: any, cell) => {
      acc[cell[1]] = cell[4].toUpperCase();
      return acc;
    }, {});
  }

  async getSitesNameAndRole(): Promise<any> {
    const data: string[] = await this.getEntireDataTableText();
    return data.reduce((acc: any, cell) => {
      acc[cell[1]] = cell[3];
      return acc;
    }, {});
  }

  private async getEntireDataTableText(): Promise<string[]> {
    const text: string[] = await this.getRows().map((row) => {
      return row.all(by.css(ACADocumentListPage.selectors.cell)).map(async (cell) => {
        return cell.getText();
      });
    });
    return text;
  }

  async getCellsContainingName(name: string): Promise<string[]> {
    const rows = this.getRows().all(by.cssContainingText(ACADocumentListPage.selectors.cell, name));
    const cellsText: string[] = await rows.map(async (cell) => {
      return cell.getText();
    });
    return cellsText;
  }

  private getRows(): ElementArrayFinder {
    return this.dataTable.rootElement.all(by.css(ACADocumentListPage.selectors.row));
  }

}

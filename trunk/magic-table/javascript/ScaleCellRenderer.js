/*

Copyright by Greg Ross, 2008

This file is part of Magic Table.

Magic Table is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Magic Table is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Magic Table.  If not, see <http://www.gnu.org/licenses/>.
*/

function ScaleCellRenderer(tableModel, cellAlignment)
{
	var defaultCellBackgroundColour = 'rgb(170, 170, 170)';
	var headerOfHeaderBackColour = 'rgb(0, 0, 0)';
	var textColour = 'rgb(0, 0, 0)';
	
	function renderCellText(canvasContext, cellValue, x1, y1, width, height, fontsize)
	{
		if (cellValue == null) return;
		
		var sValue = cellValue + "";
		var font = "sans";
		var h = CanvasTextFunctions.descent(font, fontsize) + fontsize;
		var x = (x1 + width) - width/2;
		var y = (y1 + height) - height/2;
		
		switch (cellAlignment)
		{
			case CellAlignment.LEFT:
			{
				canvasContext.drawText(font, fontsize, x1+5, y + h/2, sValue);
				break;
			}
			case CellAlignment.CENTRE:
			{
				canvasContext.drawTextCenter(font, fontsize, x, y + h/2, sValue);
				break;
			}
			case CellAlignment.RIGHT:
			{
				x = x1 + width - 3;
				canvasContext.drawTextRight(font, fontsize, x, y + h/2, sValue);
				break;
			}
		}
	}
	
	function isHeaderOfHeaders(row, column)
	{
		return (row < tableModel.columnHeaderCount && column < tableModel.rowHeaderCount);
	}
	
	this.drawCell = function(canvasContext, row, column, x1, y1, width, height, cellValue)
	{
		var cellIsHeaderOfHeader = isHeaderOfHeaders(row, column);
		
		if (cellIsHeaderOfHeader)
			canvasContext.fillStyle = headerOfHeaderBackColour;
		else 
			canvasContext.fillStyle = defaultCellBackgroundColour;
			
		canvasContext.fillRect(x1, y1, width, height);
        canvasContext.lineWidth = 1;
		
		canvasContext.lineWidth = 1.5;
		canvasContext.strokeStyle = 'rgb(220, 220, 220)';
		canvasContext.beginPath();
		
		if (cellIsHeaderOfHeader) 
		{
			canvasContext.moveTo(x1 + width, y1);
			canvasContext.lineTo(x1 + width, y1 + height);
			canvasContext.stroke();
			canvasContext.strokeStyle = 'rgb(255, 255, 255)';
			renderCellText(canvasContext, cellValue, x1, y1, width, height, 12);
		}
		else 
		{
			canvasContext.moveTo(x1 + 2, y1 + height);
			canvasContext.lineTo(x1 + 2, y1 + 2);
			canvasContext.lineTo(x1 + width, y1 + 2);
			canvasContext.stroke();
			canvasContext.strokeStyle = textColour;
			renderCellText(canvasContext, cellValue, x1, y1, width, height, 10);
		}
	}
}
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

function TableModel(rowCount, columnCount, defaultRowHeight, defaultColumnWidth, rowHeaderCount, columnHeaderCount, clrRamp)
{
	this.matrix = new Matrix();
	this.rowCount = rowCount;
	this.columnCount = columnCount;
	this.rowHeaderCount = rowHeaderCount;
	this.columnHeaderCount = columnHeaderCount;
	this.minValue = 0;
	this.maxValue = 0;
	
	this.minRowValues = [];
	this.maxRowValues = [];
	this.minColumnValues = [];
	this.maxColumnValues = [];
	
	this.rowHeights = [];
	this.columnWidths = [];
	
	var minRowHeight = 5;
	var minColumnWidth = 5;
	
	var colourRamp;
	
	this.fisheyeColumnWidth = 15;
	this.fisheyeRowHeight = 15;
	
	this.fisheyeCellRenderer = new FisheyeCellRenderer(this, colourRamp);
	this.defaultCellRenderer = new DefaultCellRenderer(this, CellAlignment.CENTRE, colourRamp);
	this.scaleCellRenderer = new ScaleCellRenderer(this, CellAlignment.CENTRE);
	init();
	
	function init()
	{
		if (clrRamp)
			colourRamp = clrRamp;
		else
			colourRamp = getDefaultColourRamp();
	}
	
	function getDefaultColourRamp()
	{
		var colour1 = {red:0, green:0, blue:255};
		var colour2 = {red:0, green:255, blue:255};
		var colour3 = {red:0, green:255, blue:0};
		var colour4 = {red:255, green:255, blue:0};
		var colour5 = {red:255, green:0, blue:0};
		return [colour1, colour2, colour3, colour4, colour5];
	}
	
	this.getCellRendererAt = function(row, column, isFisheyeCell)
	{
		if (isFisheyeCell) 
			return this.fisheyeCellRenderer;
		else 
		{
			if (TableMath.isNumber(this.rowHeaderCount))
			{
				if (column < this.rowHeaderCount)
					return this.scaleCellRenderer;
			}
			
			if (TableMath.isNumber(this.columnHeaderCount))
			{
				if (row < this.columnHeaderCount)
					return this.scaleCellRenderer;
			}
			
			return this.defaultCellRenderer;
		}
	}
	
	this.getRowHeight = function(row)
	{
		if (!TableMath.isNumber(row)) return defaultRowHeight;
		if (!this.rowHeights[row]) return defaultRowHeight;
		
		return this.rowHeights[row];
	}
	
	this.getColumnWidth = function(column)
	{
		if (!TableMath.isNumber(column)) return defaultColumnWidth;
		if (!this.columnWidths[column]) return defaultColumnWidth;
		
		return this.columnWidths[column];
	}
	
	this.setRowHeight = function(row, height)
	{
		this.rowHeights[row] = height;
	}
	
	this.setColumnWidth = function(column, width)
	{
		this.columnWidths[column] = width;
	}
	
	this.recalculateMinMaxValues = function()
	{
		var i = this.rowCount;
		var j = this.columnCount;
		
		this.minRowValues = [];
		this.maxRowValues = [];
		this.minColumnValues = [];
		this.maxColumnValues = [];
		
		do
		{
			j = this.columnCount;
			do
			{
				var row = this.rowCount - i;
				var column = this.columnCount - j
				var value = this.getContentAt(row, column);
				
				if (TableMath.isNumber(value)) 
				{
					if (this.minRowValues[row] == undefined) this.minRowValues[row] = value;
					if (this.maxRowValues[row] == undefined) this.maxRowValues[row] = value;
					if (this.minColumnValues[column] == undefined) this.minColumnValues[column] = value;
					if (this.maxColumnValues[column] == undefined) this.maxColumnValues[column] = value;
		
					if (value < this.minRowValues[row]) 
						this.minRowValues[row] = value;
					if (value > this.maxRowValues[row]) 
						this.maxRowValues[row] = value;
					if (value < this.minColumnValues[column]) 
						this.minColumnValues[column] = value;
					if (value > this.maxColumnValues[column]) 
						this.maxColumnValues[column] = value;
				}
			}	
			while(--j > 0)
		}
		while(--i > 0)
	}
	
	this.getContentAt = function(row, column)
	{
		if (!isRowValid(row) || !isColumnValid(column)) return null;
		
		return this.matrix.get([row, column]);
	}
	
	this.setContentAt = function(row, column, value)
	{
		if (!isRowValid(row) || !isColumnValid(column)) return;
		
		this.matrix.put([row, column], value);
		this.fisheyeCellRenderer = new FisheyeCellRenderer(this, colourRamp);
		this.defaultCellRenderer = new DefaultCellRenderer(this, CellAlignment.CENTRE, colourRamp);
		
		if (TableMath.isNumber(value))
		{
			value = parseFloat(value);
			
			if (this.minRowValues[row] == undefined) this.minRowValues[row] = value;
			if (this.maxRowValues[row] == undefined) this.maxRowValues[row] = value;
			if (this.minColumnValues[column] == undefined) this.minColumnValues[column] = value;
			if (this.maxColumnValues[column] == undefined) this.maxColumnValues[column] = value;
			
			if (value < this.minRowValues[row]) this.minRowValues[row] = value;
			if (value > this.maxRowValues[row]) this.maxRowValues[row] = value;
			if (value < this.minColumnValues[column]) this.minColumnValues[column] = value;
			if (value > this.maxColumnValues[column]) this.maxColumnValues[column] = value;
		}
	}
	
	function isRowValid(row)
	{
		return row >= 0 && row < rowCount;
	}
	
	function isColumnValid(column)
	{
		return column >= 0 && column < columnCount;
	}
}

TableModel.prototype.getMinValue = function()
{
	return this.matrix.minValue;
}

TableModel.prototype.getMaxValue = function()
{
	return this.matrix.maxValue;
}

TableModel.prototype.getMinValueForRow = function(row)
{
	return this.minRowValues[row];
}

TableModel.prototype.getMaxValueForRow = function(row)
{
	return this.maxRowValues[row];
}

TableModel.prototype.getMinValueForColumn = function(column)
{
	return this.minColumnValues[column];
}

TableModel.prototype.getMaxValueForColumn = function(column)
{
	return this.maxColumnValues[column];
}


var CellAlignment = {};
CellAlignment.LEFT = 0;
CellAlignment.CENTRE = 1;
CellAlignment.RIGHT = 2;
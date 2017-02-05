package net.ngeor.t3.models;

/**
 * Created by ngeor on 2/5/2017.
 */
public class Location {
    private final int row;
    private final int col;

    public Location(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    @Override
    public String toString() {
        return "row=" + row +
                ", col=" + col;
    }
}

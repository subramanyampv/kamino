package net.ngeor.t3.models;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;


/**
 * Created by ngeor on 2/7/2017.
 */
public class BoardModelTest {
    @Test
    public void getRows() {
        BoardModel model = new BoardModel(3, 2);
        assertEquals(3, model.getRows());
    }

    @Test
    public void getCols() {
        BoardModel model = new BoardModel(3, 2);
        assertEquals(2, model.getCols());
    }

    @Test
    public void getTileState() {
        BoardModel model = new BoardModel(3, 3);
        assertEquals(TileState.EMPTY, model.getTileState(0, 0));
    }

    @Test
    public void setTileState() {
        BoardModel model = new BoardModel(3, 3);
        model.setTileState(1, 1, TileState.O);
        assertEquals(TileState.O, model.getTileState(1, 1));
    }

    @Test
    public void getTileStateByLocation() {
        BoardModel model = new BoardModel(3, 3);
        model.setTileState(1, 2, TileState.X);
        assertEquals(TileState.X, model.getTileState(new Location(1, 2)));
    }

    @Test
    public void copyConstructor() {
        BoardModel model = new BoardModel(3, 3);
        model.setTileState(1, 1, TileState.O);
        BoardModel copy = new BoardModel(model);
        assertEquals(TileState.O, copy.getTileState(1, 1));
        copy.setTileState(0, 0, TileState.X);
        assertEquals(TileState.X, copy.getTileState(0, 0));
        assertEquals(TileState.EMPTY, model.getTileState(0, 0));
    }

    @Test
    public void allLocations() {
        BoardModel model = new BoardModel(2, 2);
        List<Location> allLocations = model.allLocations();
        Location[] actual = allLocations.toArray(new Location[allLocations.size()]);
        Location[] expected = new Location[] {
                new Location(0, 0),
                new Location(0, 1),
                new Location(1, 0),
                new Location(1, 1),
        };
        assertArrayEquals(expected, actual);
    }

    @Test
    public void emptyLocations() {
        BoardModel model = new BoardModel(2, 2);
        model.setTileState(0, 1, TileState.O);
        List<Location> emptyLocations = model.emptyLocations();
        Location[] actual = emptyLocations.toArray(new Location[emptyLocations.size()]);
        Location[] expected = new Location[] {
                new Location(0, 0),
                new Location(1, 0),
                new Location(1, 1),
        };
        assertArrayEquals(expected, actual);
    }

    @Test
    public void isBoardFull_OnFullBoard_ShouldBeTrue() {
        BoardModel model = new BoardModel(2, 2);
        model.setTileState(0, 0, TileState.O);
        model.setTileState(0, 1, TileState.X);
        model.setTileState(1, 0, TileState.O);
        model.setTileState(1, 1, TileState.X);
        assertEquals(true, model.isBoardFull());
    }

    @Test
    public void isBoardFull_OnBoardWithSomeEmptyLocations_ShouldBeFalse() {
        BoardModel model = new BoardModel(2, 2);
        model.setTileState(0, 0, TileState.O);
        model.setTileState(1, 0, TileState.O);
        model.setTileState(1, 1, TileState.X);
        assertEquals(false, model.isBoardFull());
    }
}

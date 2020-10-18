package net.ngeor.t3.models;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;


/**
 * Unit tests for BoardModel.
 *
 * @author ngeor on 2/7/2017.
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
        assertEquals(null, model.getTileState(0, 0));
    }

    @Test
    public void playAt() {
        BoardModel model = new BoardModel(3, 3)
                .playAt(1, 1, PlayerSymbol.O);
        assertEquals(PlayerSymbol.O, model.getTileState(1, 1));
    }

    @Test(expected = IllegalArgumentException.class)
    public void playAt_playerSymbolCannotBeNull() {
        BoardModel model = new BoardModel(3, 3);
        model.playAt(1, 1, null);
    }

    @Test(expected = IllegalStateException.class)
    public void playAt_cannotPlayOnTakenTile() {
        new BoardModel(3, 3)
                .playAt(1, 1, PlayerSymbol.O)
                .playAt(1, 1, PlayerSymbol.X);
    }

    @Test
    public void playAt_doesNotMutateOriginalModel() {
        BoardModel original = new BoardModel(3, 3);
        BoardModel modified = original.playAt(1, 1, PlayerSymbol.X);
        assertNull(original.getTileState(1, 1));
        assertEquals(PlayerSymbol.X, modified.getTileState(1, 1));
    }

    @Test
    public void getTileStateByLocation() {
        BoardModel model = new BoardModel(3, 3)
                .playAt(1, 2, PlayerSymbol.X);
        assertEquals(PlayerSymbol.X, model.getTileState(new Location(1, 2)));
    }

    @Test
    public void allLocations() {
        BoardModel model = new BoardModel(2, 2);
        List<Location> allLocations = model.allLocations();
        Location[] actual = allLocations.toArray(new Location[allLocations.size()]);
        Location[] expected = new Location[]{
                new Location(0, 0),
                new Location(0, 1),
                new Location(1, 0),
                new Location(1, 1),
        };
        assertArrayEquals(expected, actual);
    }

    @Test
    public void emptyLocations() {
        BoardModel model = new BoardModel(2, 2)
                .playAt(0, 1, PlayerSymbol.O);
        List<Location> emptyLocations = model.emptyLocations();
        Location[] actual = emptyLocations.toArray(new Location[emptyLocations.size()]);
        Location[] expected = new Location[]{
                new Location(0, 0),
                new Location(1, 0),
                new Location(1, 1),
        };
        assertArrayEquals(expected, actual);
    }

    @Test
    public void isBoardFull_OnFullBoard_ShouldBeTrue() {
        BoardModel model = new BoardModel(2, 2)
                .playAt(0, 0, PlayerSymbol.O)
                .playAt(0, 1, PlayerSymbol.X)
                .playAt(1, 0, PlayerSymbol.O)
                .playAt(1, 1, PlayerSymbol.X);
        assertEquals(true, model.isBoardFull());
    }

    @Test
    public void isBoardFull_OnBoardWithSomeEmptyLocations_ShouldBeFalse() {
        BoardModel model = new BoardModel(2, 2)
                .playAt(0, 0, PlayerSymbol.O)
                .playAt(1, 0, PlayerSymbol.O)
                .playAt(1, 1, PlayerSymbol.X);
        assertEquals(false, model.isBoardFull());
    }
}

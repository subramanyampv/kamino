package net.ngeor.t3.models;

/**
 * Created by ngeor on 2/6/2017.
 */
public class Tile {
    private final GameDto owner;
    private final Location location;
    private TileState state;

    public Tile(GameDto owner, Location location) {
        this.owner = owner;
        this.location = location;
        this.state = TileState.Empty;
    }

    public Tile(GameDto owner, Tile tile) {
        this.owner = owner;
        this.location = tile.getLocation();
        this.state = tile.state;
    }

    public GameDto getOwner() {
        return owner;
    }

    public Location getLocation() {
        return location;
    }

    public boolean isEmpty() {
        return getState() == TileState.Empty;
    }

    public TileState getState() {
        return state;
    }

    void setState(TileState state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Tile tile = (Tile) o;

        return location.equals(tile.location);
    }

    @Override
    public int hashCode() {
        int result = location.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "Tile{" +
                "owner=" + owner +
                ", location=" + location +
                '}';
    }

    public boolean isCpu() {
        return getState() == TileState.fromPlayer(getOwner().getGameParameters().getHumanPlayer().opponent());
    }

    public boolean isHuman() {
        return getState() == TileState.fromPlayer(getOwner().getGameParameters().getHumanPlayer());
    }

    public void play() {
        owner.play(location.getRow(), location.getCol());
    }
}

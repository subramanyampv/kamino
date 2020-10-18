package net.ngeor.t3.models;

public interface MutableGameModel extends ImmutableGameModel {
    void start();

    void play(int row, int col);

    void addGameModelListener(GameModelListener gameModelListener);

    void removeGameModelListener(GameModelListener gameModelListener);
}

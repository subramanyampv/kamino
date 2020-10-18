package net.ngeor.t3.models;

public interface ImmutableGameModel extends GameModel {
    ImmutableGameModel immutableStart();

    ImmutableGameModel immutablePlay(int row, int col);
}
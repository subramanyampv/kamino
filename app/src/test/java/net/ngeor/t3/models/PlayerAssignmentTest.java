package net.ngeor.t3.models;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by ngeor on 2/7/2017.
 */
public class PlayerAssignmentTest {
    @Test
    public void getPlayerTypeShouldReturnHumanForX() {
        PlayerAssignment playerAssignment = new PlayerAssignment(Player.X);
        PlayerType playerType = playerAssignment.getPlayerType(Player.X);
        assertEquals(PlayerType.HUMAN, playerType);
    }

    @Test
    public void getPlayerTypeShouldReturnCPUForO() {
        PlayerAssignment playerAssignment = new PlayerAssignment(Player.X);
        PlayerType playerType = playerAssignment.getPlayerType(Player.O);
        assertEquals(PlayerType.CPU, playerType);
    }

    @Test
    public void getFirstPlayerX() {
        PlayerAssignment playerAssignment = new PlayerAssignment(Player.X);
        assertEquals(Player.X, playerAssignment.getFirstPlayer());
    }

    @Test
    public void getFirstPlayerO() {
        PlayerAssignment playerAssignment = new PlayerAssignment(Player.O);
        assertEquals(Player.O, playerAssignment.getFirstPlayer());
    }

}

package net.ngeor.t3.ai;

/**
 * Represents a background task that can be cancelled.
 */
@FunctionalInterface
public interface Cancellable {
    /**
     * Checks if the background task has been cancelled.
     */
    boolean isCancelled();
}
